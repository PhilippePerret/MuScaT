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

    FOLDER      = ARGV.shift
    AFFIXE      = ARGV.shift || 'image'
    KSORT_NAME  = ARGV.shift == '-name'

    EXTENSIONS = %w{JPG jpg JPEG jpeg PNG png TIFF tiff}
    EXTENSIONS_STR = EXTENSIONS.join(',')
    FOLDER || raise('Il faut définir le chemin au dossier contenant les images !')
    File.directory?(FOLDER) || raise('%s devrait être un chemin de dossier.' % FOLDER.inspect)
    img_files = Dir["#{FOLDER}/*.{#{EXTENSIONS_STR}}"]
    nombre_images = img_files.count
    nombre_images > 0 || raise('Le dossier %s ne semble contenir aucune image (extensions prises en compte : %s).' % [FOLDER, EXTENSIONS.join(', ')])

    # Les fichiers sont classés par date de modification
    if KSORT_NAME
      img_files.sort!
    else
      img_files.sort_by!{ |path| File.stat(path).mtime }
    end



    img_files.each_with_index do |src, idx|
      dst = File.join(FOLDER, "#{AFFIXE}-#{idx}#{File.extname(src)}")
      File.rename(src, dst)
      puts "#{File.basename(src)} -> #{File.basename(dst)}"
    end

    puts "\n\n\n  Opération exécutée avec succès.\n\n\n".vert

  rescue Exception => e
    puts "\n\n\tERREUR: #{e.message}\n\n(pour obtenir de l'aide, jouez `./rename_images.rb --help` — ou `-h`)\n\n".blanc_sur_fond_rouge
  end


else



puts <<-HELP

  Ce script permet de renommer tous les fichiers images d'un dossier
  en les indexant de 1 en 1.

  USAGE
  -----
    #{'./rename_images.rb <chemin/vers/dossier>[ <affixe nom>][ <clé classement>]'.jaune}

    On doit se trouver dans le dossier `utils` de MuScaT, pas dans le
    dossier de l'analyse.

    Le #{'chemin/vers/dossier'} est le chemin relatif ou absolu qui conduit
    au dossier contenant les images à renommer.

    L'#{'`<affixe nom>`'.jaune} est le nom sans l'extension. Par exemple, si
    l'affixe est défini à 'mes-images', les fichiers seront re-
    nommés : "mes-images-1.png", "mes-images-2.png" etc. L'exten-
    sion est celle du fichier original.

    Si la #{'<clé classement>'.jaune} est `-name`, le classement des fichiers ne
    se fait plus par la date de création (comportement normal) mais
    par le nom du fichier.

  ASTUCE
  ------

    Le chemin vers le dossier peut être obtenu simplement en glissant
    le dossier dans la fenêtre du Terminal (ou la console) après le
    texte `./rename_images ` (ne pas oublier l'espace au bout avant
    de glisser le dossier).

  EXEMPLES
  --------

    #{'> cd /Users/chezmoi/Programmes/MuScaT
    > ./utils/rename_images.rb /Users/chezmoi/Music/Analyses/monAnalyse/images'.jaune}

    Ci-dessus, tous les fichiers du dossier `monAnalyse/images` se-
    ront renommés en "image-X.png" dans l'ordre de leur création.

    #{'> dMuscat="/Users/chezmoi/Programmes/MuScaT"
    > dImages="/Users/chezmoi/Music/Analyses/Mozart/monAnalyse/images"
    > cd $dMuscat
    > ./utils/rename_images.rb $dImages mozart-sonata -name'.jaune}

    Ci-dessus, tous les fichiers du dossier `monAnalyse/images` se
    trouvant dans mes analyses de Mozart, au format `.jpg`, seront
    renommés 'mozart-sonata-1.jpg', 'mozart-sonata-2.jpg', ...
    'mozart-sonata-N.jpg' en les classant par leur nom (`-name`).

    Noter le deuxième paramètre ("mozart-sonata") qui définit l'affi-
    xe des fichiers finaux et le troisième paramètre ("-name") qui
    modifie la clé de classement des fichiers.

    Noter également l'utilisation de variable (`dMuscat`,`dImages`)
    pour faciliter l'écriture. Le dossier `dMuscat`, par exemple,
    pourrait être défini dans votre fichier `.bash` pour être utili-
    sé partout.

HELP

end #/if (help)
