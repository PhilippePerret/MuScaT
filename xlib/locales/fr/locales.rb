# frozen_string_literal: true
# encoding: UTF-8

create_confirmation = <<-EOT

  La nouvelle analyse a été créée avec succès.

  Vous pouvez ouvrir le fichier `_tags_.js` pour la modifier.

  Pour voir cette analyse et la travailler, copier-colle son fichier
  `analyse.js` à la racine du dossier de MuScaT ou, mieux, utiliser la
  commande `analyse` suivi du nom de cette analyse.

  Sans alias :
    > cd "#{APPFOLDER}"
    > ./utils/analyse.rb %{name}

  Avec un alias :
    > mus analyse %{name}


EOT

LOCALES = {

  'analysis-folder' => "Dossier analyse : %{name}",

  'analysis-folder-chosen' => "Vous avez choisi le dossier d'analyse : %{name}",
  'folder-captures-set' => "Le dossier des captures a été mis à %{name}.",

  # === CONFIRMATIONS ===

  'operation-successful' => "#{RC * 3}#{INDENT}Opération exécutée avec succès.#{RC * 3}",
  'create-confirmation' => create_confirmation,
  'export-to-pdf' => "Il suffit maintenant d'exporter ce document HTML au format PDF.",
  'lang-successfully-defined' => "D'accord, maintenant je parle français dans le texte.",
  'editor-successfully-defined' => "Votre éditeur a été défini.",

  # === QUESTIONS ===

  'which-folder' => "Quel dossier choisir (lettre) ? ('q' pour renoncer)",

  # === ERREURS ===

  'folder-images-required' => 'Il faut définir le chemin au dossier contenant les images !',
  'should-be-folder-path'  => '%{path} devrait être un chemin de dossier.',
  'no-images-in-folder' => 'Le dossier %{path} ne semble contenir aucune image (extensions prises en compte : %{extensions}).',

  'no-folder-found' =>  "Aucun dossier d'analyse n'a été trouvé avec « %{name} »",
  'folder-built' => 'Le dossier "%{name}" a été construit',
  'folder-unfound' => 'Le dossier "%{name}" est introuvable.',
  'unknown-folder' => "Dossier inconnu, je ne peux rien faire pour vous…",

  'analysis-name-required' => "Il faut définir le nom de l'analyse en premier argument.",
  'analysis-folder-built' => "Dossier des analyses construit.",
  'analysis-folder-already-exists' => "Ce dossier d'analyse existe déjà.#{RC}\t\tDétruisez-le ou choisissez un autre nom.",

  # == UNKNOWN ==
  'unknown-command' => "Désolé, je ne connais pas la commande `%{command}'…\nPour obtenir de l'aide, mettre `help` ou `aide` en premier argument.",
  'unknown-property' => 'Je ne connais pas la propriété "%{prop}", je ne peux pas la définir.',
  'unknown-lang' => "MuScaT ne sait pas (encore) parler la langue désignée par '%{lang}'. Vous voulez vous proposer pour en faire la traduction ?",

  'fatal-error' => "\n\n\tERREUR: %{err_msg}\n\n(pour obtenir de l'aide, jouez './utils/%{command}.rb --help' — ou '-h')\n\n"



}
