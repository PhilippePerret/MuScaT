#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour renommer les fichiers du dossier donné en argument.
=end
require_relative 'required'

TAGS_JS_DEFAULT_CODE = <<-EOT
// L'option 'code' permet de voir le code à côté de l'analyse
// sur la table
// L'option 'guides' affiche les deux lignes qui
// permettent d'aligner les éléments
option('code', 'guides');

// Définir ci-dessous tous les TAGs

Tags = `
// -- TAGS --
tex Ma_première_analyse x=200 y=200
`;

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

    analyse_name = analyse.name.gsub(/[  \t]/,'_')

    # On s'assure d'abord que les dossiers existe
    unless File.exist?(ANALYSES_FOLDER)
      `mkdir -p "#{ANALYSES_FOLDER}"`
      puts "Dossier des analyses construit."
    end
    unless File.exist?(TABLE_FOLDER)
      `mkdir -p "#{TABLE_FOLDER}"`
      puts "Table des analyses construite avec succès."
    end

    # On se place toujours dans le dossier principal de Muscat pour
    # faire ces opérations
    Dir.chdir(APPFOLDER) do

      analyse_folder = File.join(ANALYSES_FOLDER, analyse_name)
      if File.exist?(analyse_folder)
        raise "Un dossier d'analyse de même nom existe déjà. Vous devez le détruire « à la main » pour en recréer un de même nom."
      end
      `mkdir -p "#{File.join(analyse_folder,'analyse','images')}"`
      analyse_tags_file = File.join(analyse_folder,'analyse','tags.js')
      File.open(analyse_tags_file,'wb'){|f| f.write(TAGS_JS_DEFAULT_CODE)}

      if ARGV.include?('-o') || ARGV.include?('--open')
        `open "#{analyse_folder}"`
      end

      puts <<-EOT


La nouvelle analyse a été créée avec succès.

Vous pouvez ouvrir le fichier `tags.js` pour la modifier.

Pour pouvoir voir cette analyse et la travailler, vous devez dupliquer
son dossier `analyse` (contenant `tags.js` et le dossier `images`) sur
la table d'analyse (le dossier `_table_analyse_`) en détruisant l'ana-
lyse qui s'y trouve (si c'est une duplication) ou en replaçant son
dossier `analyse` dans son dossier principal.

Notez que vous pouvez activer une analyse de façon très simple grâce
au script `./reload.rb <nom_de_lanalyse>` qui fait toutes ces opéra-
tions pour vous.


      EOT
    end


  rescue Exception => e
    puts "\n\n\tERREUR: #{e.message}\n\n(pour obtenir de l'aide, jouez `./rename_images --help` — ou `-h`)\n\n".blanc_sur_fond_rouge
  end

else



puts <<-HELP

  Ce script permet de créer une nouvelle analyse dans le dossier
  `analyses` de MuScaT.

  USAGE
  -----
    #{'./create.rb "<nom analyse>"'.jaune}

    Note : si on se trouve dans le dossier principal de MuScaT, il faut
    faire `./utils/create`.


    Le #{'<nom analyse>'} est le nom que prendra le dossier principale
    de l'analyse. Il faut le mettre entre guillemets s'il contient des
    espaces mais, de toutes façons, les espaces seront toujours rem-
    placées par des traits plats.

HELP

end #/if (help)