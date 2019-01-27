#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour renommer les fichiers du dossier donné en argument.
=end
require_relative 'required'

WHAT = ARGV.shift

unless ARGV.include?('-h') || ARGV.include?('--help') || WHAT.nil?
  begin

    case WHAT
    when 'manuel'
      Dir.chdir(File.join(APPFOLDER,'Manuel')) do
        `pandoc -s Manuel.md --css="manuel.css" --metadata pagetitle="Manuel" --from=markdown --output=Manuel.html;open Manuel.html;`
      end
      # Pour ne pas avoir à confirmer la commande "Remplacer", on détruit le
      # fichier original
      pth = File.join(APPFOLDER,'Manuel','Manuel.pdf')
      File.unlink(pth) if File.exist?(pth)
      puts "Il suffit maintenant d'exporter ce document HTML au format PDF.".vert
    end
  rescue Exception => e
    puts "\n\n\tERREUR: #{e.message}\n\n(pour obtenir de l'aide, jouez `./create.rb --help` — ou `-h`)\n\n".blanc_sur_fond_rouge
  end

else



puts <<-HELP
\033c

  Ce script permet d'actualiser divers éléments de l'application.
  Pour le moment, il ne sert qu'à actualiser le manuel, en jouant :

    #{'./update.rb manuel'.jaune}

  USAGE
  -----
    #{'./update.rb <chose à updater>'.jaune}

HELP

end #/if (help)
