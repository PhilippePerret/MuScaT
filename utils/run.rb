#!/usr/bin/env ruby
# encoding: UTF-8
=begin

  Ce script permet d'être utilisé pour faire un alias dans son profil bash
  pour pouvoir utiliser une commande comme :

      > mus create "Ma nouvelle analyse"

=end
require_relative 'required'


AIDE = <<-EOT
\033c
  AIDE DE LA COMMANDE MUSCAT run.rb
  ---------------------------------

  Cette commande permet d'utiliser plus simplement l'application en
  ligne de commande grâce à un alias créé dans votre profil bash.
  Consulter le manuel pour le détail.

  En considérant que `mus` est votre alias, vous pouvez utiliser :

  #{'> mus create "Nouvelle Analyse"[ -o]'.jaune}

      Pour créer une nouvelle analyse. Avec l'option `-o`, le dossier
      s'ouvre dans le Finder.

  #{'> mus analyse "Nom de l’analyse"'.jaune}

      Permet de lancer l'analyse portant le nom "Nom de l’analyse"
      (qui peut être seulement le début du nom).
      En ne mettant aucun argument (`> mus analyse`) on obtient la
      liste de toutes les analyses du dossier `_analyses_`.

  #{'> mus test -o'.jaune}

      Lance les tests (en ouvrant le fichier test.html dans Firefox).

EOT


# ---------------------------------------------------------------------
# TRAITEMENT DE LA LIGNE DE COMMANDE
COMMAND_LANG = {
  'aide':                     'help',
  'ouvre':                    'open',
  'créer':                    'create',
  'renommer_images':          'rename_images',
  'change_dossier_captures':  'change_folder_caputres'
}

# La commande
cmd = ARGV.shift
COMMAND = COMMAND_LANG[cmd] || cmd

if !COMMAND || COMMAND == 'help'
  # Afficher l'aide
  # puts "\033c"
  puts AIDE
elsif File.exist?(File.join(APPFOLDER,'utils',"#{COMMAND}.rb"))
  # C'est bon, on peut le faire
  # On se place toujours dans l'application
  Dir.chdir(APPFOLDER) do
    require_relative COMMAND
  end

else
  puts "\n\nDésolé, je ne connais pas la commande `#{COMMAND}`…\nPour obtenir de l'aide, mettre `help` ou `aide` en premier argument.\n\n".rouge
end
