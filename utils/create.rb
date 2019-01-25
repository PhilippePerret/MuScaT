#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour renommer les fichiers du dossier donné en argument.
=end
require 'fileutils'
require_relative 'required'

INFOS_CODE = <<-EOT
INFOS = {
  analyse_name:   "%{analyse_name}",
  author:          "#{File.basename(Dir.home)}",
  created_at:     #{Time.now.to_i},
  muscat_version:  "#{File.read(File.join(APPFOLDER,'xlib','VERSION')).strip}"
}
EOT
unless ARGV.include?('-h') || ARGV.include?('--help')
  begin

    # On s'assure qu'un nom ait été donné
    analyse_name = nil
    ARGV.each do |arg|
      unless analyse_name || arg.start_with?('-')
        analyse_name = arg
        break
      end
    end

    analyse_name || raise("Il faut définir le nom de l'analyse en premier argument.")

    analyse_name = analyse_name.gsub(/[  \t]/,'_')

    # On s'assure d'abord que les dossiers existe
    unless File.exist?(ANALYSES_FOLDER)
      `mkdir -p "#{ANALYSES_FOLDER}"`
      puts "Dossier des analyses construit."
    end

    ANALYSE_FOLDER  = File.join(ANALYSES_FOLDER,analyse_name)
    puts "Dossier analyse: #{ANALYSE_FOLDER}"
    if File.exist?(ANALYSE_FOLDER)
      raise "Ce dossier d'analyse existe déjà.\n\t\tDétruisez-le ou choisissez un autre nom."
    end
    TEMPLATE_FOLDER = File.join(ANALYSES_FOLDER,'Template')

    FileUtils.cp_r("#{TEMPLATE_FOLDER}/", ANALYSE_FOLDER)

    analyse_tags_file = File.join(ANALYSE_FOLDER,'analyse.js')
    File.open(analyse_tags_file,'wb'){|f| f.write('const ANALYSE="%s";' % [analyse_name])}
    infos_file = File.join(ANALYSE_FOLDER,'.infos.rb')
    File.open(infos_file,'wb'){|f|f.write(INFOS_CODE % {analyse_name: analyse_name})}

    if ARGV.include?('-o') || ARGV.include?('--open')
      `open "#{analyse_folder}"`
    end

    msg_confirm = <<-EOT


La nouvelle analyse a été créée avec succès.

Vous pouvez ouvrir le fichier `tags.js` pour la modifier.

Pour voir cette analyse et la travailler, copier-colle son fichier
`analyse.js` à la racine du dossier de MuScaT ou, mieux, utiliser la
commande `analyse` suivi du nom de cette analyse.

Sans alias :
    > cd "#{APPFOLDER}"
    > ./utils/analyse.rb #{analyse_name}

Avec un alias :
    > mus analyse #{analyse_name}


    EOT

    puts msg_confirm.vert

  rescue Exception => e
    puts "\n\n\tERREUR: #{e.message}\n\n(pour obtenir de l'aide, jouez `./create.rb --help` — ou `-h`)\n\n".blanc_sur_fond_rouge
  end

else



puts <<-HELP

  Ce script permet de créer une nouvelle analyse dans le dossier
  `analyses` de MuScaT.

  USAGE
  -----
    #{'./create.rb "<nom analyse>"'.jaune}

    Note : si on se trouve dans le dossier principal de MuScaT, il faut
    faire `./utils/create.rb`.


    Le #{'<nom analyse>'} est le nom que prendra le dossier principale
    de l'analyse. Il faut le mettre entre guillemets s'il contient des
    espaces mais, de toutes façons, les espaces seront toujours rem-
    placées par des traits plats.

HELP

end #/if (help)
