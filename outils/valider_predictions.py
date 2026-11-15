#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vérifie predictions/set19.json avant publication.

    python3 outils/valider_predictions.py [chemin]

Sort en erreur (code 1) si une règle est violée ; affiche des avertissements
sans bloquer pour ce qui manque mais n'est pas faux (traductions coréennes,
japonaises et chinoises : la page retombe alors sur l'anglais).

Les règles disent ce qu'est une prédiction publiable :
- une compo qui n'est pas « spéculative » cite au moins une source ;
- chaque texte existe au moins en français et en anglais ;
- aucun identifiant de joueur ni clé d'API ne sort.
"""
import json, re, sys
from datetime import datetime

ETATS = {"attente", "fuites", "pbe", "termine"}
CASES = set("ABCDEFG")
CONFIANCES = {"forte", "moyenne", "speculative"}
LANGUES_REQUISES = ("fr", "en")
LANGUES_SOUHAITEES = ("ko", "ja", "zh")

erreurs, avertissements = [], []


def err(m): erreurs.append(m)
def avert(m): avertissements.append(m)


def texte(x, ou, requis=True):
    """Un texte est une chaîne (identique dans toutes les langues : un nom
    propre) ou un objet {fr, en, ko, ja, zh}."""
    if x is None:
        if requis:
            err(f"{ou} : manquant")
        return
    if isinstance(x, str):
        if not x.strip():
            err(f"{ou} : vide")
        return
    if not isinstance(x, dict):
        err(f"{ou} : ni texte ni objet de traductions")
        return
    for l in LANGUES_REQUISES:
        if not str(x.get(l) or "").strip():
            err(f"{ou} : pas de version « {l} »")
    manque = [l for l in LANGUES_SOUHAITEES if not str(x.get(l) or "").strip()]
    if manque:
        avert(f"{ou} : sans {', '.join(manque)} (la page affichera l'anglais)")


def unite(u, ou):
    if not isinstance(u, dict):
        err(f"{ou} : pas un objet")
        return
    texte(u.get("nom"), f"{ou}.nom")
    c = u.get("cout")
    if c is not None and not (isinstance(c, int) and 1 <= c <= 10):
        err(f"{ou}.cout : {c!r} n'est pas un coût")


def main():
    chemin = sys.argv[1] if len(sys.argv) > 1 else "predictions/set19.json"
    brut = open(chemin, encoding="utf-8").read()
    for interdit in ("puuid", "RGAPI-"):
        if interdit.lower() in brut.lower():
            err(f"le fichier contient « {interdit} » : rien d'identifiant ne se publie")
    d = json.loads(brut)

    if d.get("schema") != 1:
        err(f"schema : {d.get('schema')!r}, attendu 1")
    if not isinstance(d.get("set"), int):
        err("set : doit être un entier")
    if d.get("etat") not in ETATS:
        err(f"etat : {d.get('etat')!r}, attendu un de {sorted(ETATS)}")
    try:
        datetime.fromisoformat(str(d.get("maj")))
    except ValueError:
        err(f"maj : {d.get('maj')!r} n'est pas une date ISO")

    compos = d.get("compos") or []
    if d.get("etat") == "attente" and compos:
        err("etat « attente » mais des compos sont présentes")
    if d.get("etat") in ("fuites", "pbe") and not compos:
        avert(f"etat « {d.get('etat')} » sans aucune compo")

    ids = set()
    for i, c in enumerate(compos):
        ou = f"compos[{i}]"
        cid = c.get("id")
        if not cid or not re.fullmatch(r"[a-z0-9-]+", str(cid)):
            err(f"{ou}.id : {cid!r} (minuscules, chiffres et tirets)")
        elif cid in ids:
            err(f"{ou}.id : {cid} en double")
        ids.add(cid)
        ou = f"compo « {cid} »"
        if c.get("case") not in CASES:
            err(f"{ou}.case : {c.get('case')!r}, attendu A à G")
        if c.get("confiance") not in CONFIANCES:
            err(f"{ou}.confiance : {c.get('confiance')!r}")
        texte(c.get("nom"), f"{ou}.nom")
        texte(c.get("pourquoi"), f"{ou}.pourquoi", requis=False)
        texte(c.get("tomberait_si"), f"{ou}.tomberait_si", requis=False)
        if not c.get("porteurs"):
            err(f"{ou} : aucun porteur")
        for k in ("porteurs", "front", "debut"):
            for j, u in enumerate(c.get(k) or []):
                unite(u, f"{ou}.{k}[{j}]")
        for j, t in enumerate(c.get("traits") or []):
            texte(t.get("nom"), f"{ou}.traits[{j}].nom")
        for j, o in enumerate(c.get("objets") or []):
            for m, x in enumerate(o.get("objets") or []):
                texte(x, f"{ou}.objets[{j}][{m}]")
        for j, x in enumerate(c.get("composants") or []):
            texte(x, f"{ou}.composants[{j}]")
        db = c.get("deblocage")
        if db:
            unite(db, f"{ou}.deblocage")
            if not isinstance(db.get("sur_le_chemin"), bool):
                err(f"{ou}.deblocage.sur_le_chemin : vrai ou faux")
            texte(db.get("condition"), f"{ou}.deblocage.condition", requis=False)
        if c.get("true_damage") not in (None, "A", "B"):
            err(f"{ou}.true_damage : {c.get('true_damage')!r}")
        if c.get("verdict") not in (None, "tenue", "tombee"):
            err(f"{ou}.verdict : {c.get('verdict')!r}")
        sources = [s for s in (c.get("sources") or [])
                   if re.match(r"^https?://", str(s.get("url") or ""))]
        if len(sources) != len(c.get("sources") or []):
            err(f"{ou}.sources : une source sans adresse http(s)")
        if c.get("confiance") != "speculative" and not sources:
            err(f"{ou} : confiance « {c.get('confiance')} » sans aucune source — "
                "une compo non spéculative cite d'où viennent ses champions")

    for a in avertissements:
        print(f"  avertissement · {a}")
    for e in erreurs:
        print(f"  ERREUR · {e}")
    print(f"{chemin} : {len(compos)} compo(s), {len(erreurs)} erreur(s), "
          f"{len(avertissements)} avertissement(s)")
    sys.exit(1 if erreurs else 0)


if __name__ == "__main__":
    main()
