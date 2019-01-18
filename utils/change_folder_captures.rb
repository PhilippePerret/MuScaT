#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour renommer les fichiers du dossier donné en argument.
=end
require_relative 'required'

unless ARGV.include?('-h') || ARGV.include?('--help')
  begin

    # 'Mon texte'.essai
    # exit
    msgs = Array.new

    DST_FOLDER = ARGV.shift || File.join(Dir.home,'Desktop')
    CREATE_IT  = ARGV.shift == '-mk'

    unless File.exist?(DST_FOLDER)
      if CREATE_IT
        `mkdir -p #{DST_FOLDER}`
        msgs << "Le dossier #{DST_FOLDER} a été construit"
      else
        raise "Le dossier #{DST_FOLDER} est introuvable."
      end
    end

    # On exécute le changement
    `defaults write com.apple.screencapture location "#{DST_FOLDER}"`

    msgs << "Le dossier des captures a été mis à #{DST_FOLDER}."
    msgs = INDENT + msgs.join("\n#{INDENT}")
    puts "\n\n\n#{msgs}\n\n\n".vert

  rescue Exception => e
    puts "\n\n\tERREUR: #{e.message}\n\n(pour obtenir de l'aide, jouez `./change_folder_captures --help` — ou `-h`)\n\n".blanc_sur_fond_rouge
  end


else



puts <<-HELP

  Ce script permet de définir le dossier qui va recevoir les captures
  écran, ou de le remettre à sa valeur par défaut.

  USAGE
  -----
    #{'./change_folder_captures.rb[ ./chemin/vers/dossier][ options][-h]'.jaune}

    Le dossier `chemin/vers/dossier` devient le dossier qui va rece-
    voir toutes les captures. S'il n'est pas défini, c'est le dossier
    par défaut (le bureau) qui est remis.

    Les #{'options'.jaune} peuvent être `-mk` qui indique qu'il faut
    construire le dossier s'il n'existe pas.

    #{'-h'.jaune} ou #{'--help'.jaune} à la fin de la ligne indique
    qu'il faut afficher cette aide.

  ASTUCE
  ------

    Le chemin vers le dossier peut être obtenu simplement en glissant
    le dossier dans la fenêtre du Terminal (ou la console) après le
    texte `./change_folder_captures ` (ne pas oublier l'espace au
    bout avant de glisser le dossier).

  EXEMPLES
  --------

    #{'> cd /Users/chezmoi/Programmes/MuScaT
    > ./utils/change_folder_captures.rb /Users/chezmoi/Music/Analyses/ -mk'.jaune}

    Le dossier `~/Music/Analyses` devient le dossier où sont enregis-
    trées les captures d'écran.
    Le dossier est construit s'il n'existe pas (option `-mk`).

    #{'> ./utils/change_folder_captures.rb'.jaune}

    Le dossier des captures d'écran est remis à sa valeur par défaut.

    #{'> ./utils/change_folder_captures.rb -h'.jaune}

    Affiche cette aide.

HELP

end #/if (help)
