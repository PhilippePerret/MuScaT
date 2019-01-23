#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour activer une analyse
=end
require 'io/console'
require 'fileutils'
require_relative 'required'

# Méthode pour sauver l'analyse courante dans son dossier
def save_current_analyse
  puts "Sauvegarde de l'analyse courante…"
  folder_original_current_analyse = File.join(ANALYSES_FOLDER,INFOS[:analyse_name],'analyse')
  FileUtils.rm_rf(folder_original_current_analyse)
  FileUtils.cp_r(CURRENT_ANALYSE_FOLDER,folder_original_current_analyse)
  puts "Analyse courante sauvegardée."
end

def faire_un_choix question

  question = <<-EOF

  #{question.split(RC).join(RC+INDENT)}
  Que faire ?
    s: sauvegarder les changements de l'analyse courante,
    q: renoncer
    o/y: perdre les changements et activer l'analyse « #{ANALYSE_NAME} ».

  EOF
  puts question.vert
  print 'Votre choix : '
  choix = STDIN.getch()
  return choix
end

# Méthode qui détruit la nouvelle analyse après avoir fait toutes les
# vérifications possibles
def detruire_analyse_courante
  infos_path = File.join(CURRENT_ANALYSE_FOLDER,'.infos.rb')
  if File.exist?(infos_path)
    require infos_path # => INFOS

    puts "L'analyse courante est : #{INFOS[:analyse_name]} de #{INFOS[:author]}"
    folder_original_current_analyse = File.join(ANALYSES_FOLDER,INFOS[:analyse_name],'analyse')
    if File.exist?(folder_original_current_analyse)
      tags_js_original = File.join(folder_original_current_analyse,'tags.js')
      if File.exist?(tags_js_original)
        tags_js_courant = File.join(CURRENT_ANALYSE_FOLDER,'tags.js')
        if File.stat(tags_js_courant).mtime > File.stat(tags_js_original).mtime
          choix = faire_un_choix("Le fichier tags.js de l'analyse « #{INFOS[:analyse_name]} » a été modifié.\nSi vous activez la nouvelle analyse, vous allez perdre les changements.")
          case choix.downcase
          when 'q'
            return false # s'arrêter là
          when 'o','y'
            return true # Détruire l'analyse sans rien faire
          when 's'
            save_current_analyse
            return true # on peut le détruire, maintenant
          end
        end
      end
      folder_images_original = File.join(folder_original_current_analyse,'images')
      if File.exist?(folder_images_original)
        folder_images_current = File.join(CURRENT_ANALYSE_FOLDER,'images')
        if File.stat(folder_images_current).mtime > File.stat(folder_images_original).mtime
          choix = faire_un_choix("Le dossier images de l'analyse « #{INFOS[:analyse_name]} » a été modifié.\nSi vous activez la nouvelle analyse, vous allez perdre tous les changements.")
          case choix.downcase
          when 'q'
            return false # s'arrêter là
          when 'o','y'
            return true # Détruire l'analyse sans rien faire
          when 's'
            save_current_analyse
            return true # on peut le détruire, maintenant
          end
        end
      end
      # Finalement, si tout est OK, on peut la détruire
      return true
    else
      # Le dossier original a été détruit depuis
      return true
    end
  else
    # Pas de fichier .infos => pas de sauvegarde possible
    return true
  end
  return false
end

unless ARGV.include?('-h') || ARGV.include?('--help')
  begin

    # On cherche le nom donné en argument
    analyse_name    = nil
    analyse_folder  = nil

    ARGV.each do |arg|
      arg.start_with?('-') && next
      analyse_name = arg
      break
    end

    # Dans tous les cas, on fait la liste des dossier d'analyses, qui
    # pourra toujours servir
    names_list = Dir["#{ANALYSES_FOLDER}/*"].collect{|d| File.basename(d)}

    # Si aucun nom n'a été donné, on présente toute la liste
    names = nil
    if analyse_name.nil?
      names = names_list
    elsif File.exist?(File.join(ANALYSES_FOLDER,analyse_name))
      analyse_folder = File.join(ANALYSES_FOLDER,analyse_name,'analyse')
    else
      # Mauvais nom ou
      names = Array.new
      name_list.each do |name|
        if name.start_with?(analyse_name)
          names << name
        end
      end
      if names.count == 1
        analyse_folder = File.join(ANALYSES_FOLDER,names.first,'analyse')
      end
    end

    unless analyse_folder
      # Quand il faut choisir
      puts "\n\n"
      names.each_with_index do |aname, idx|
        puts "    #{(97+idx).chr}: #{aname}"
      end
      puts "\n\n"
      print "Quel dossier choisir (lettre) ? "
      choix = STDIN.getch()
      puts ''
      if choix == 'q'
        exit 1
      end
      choix = choix.ord - 97
      analyse_folder = File.join(ANALYSES_FOLDER,names[choix],'analyse')
    end

    ANALYSE_FOLDER  = analyse_folder
    ANALYSE_NAME    = File.basename(File.dirname(analyse_folder))

    if analyse_folder
      puts "Dossier choisi : #{analyse_folder.inspect}"
      # On ouvre le dossier (ou plutôt, on le met en dossier courant)

      # Si le dossier analyse courant a un fichier indiquant son nom,
      # je dois m'assurer qu'il a bien été sauvegarder (date). Si ce n'est
      # pas le cas, je le confie à l'utilisateur.
      if detruire_analyse_courante
        # On peut procéder au changement
        if File.exist?(CURRENT_ANALYSE_FOLDER)
          FileUtils.rm_rf(CURRENT_ANALYSE_FOLDER)
        end
        FileUtils.cp_r(analyse_folder, CURRENT_ANALYSE_FOLDER)
        # Enfin, on ouvre la partition
        `open -a Firefox "#{PARTITION_PATH}"`
      else
        puts "Je ne détruis pas l'analyse courante."
      end
    else
      puts "Dossier inconnu, je ne peux rien faire pour vous…"
    end


  rescue Exception => e
    puts "\n\n\tERREUR: #{e.message}\n\n(pour obtenir de l'aide, jouez `./analyse.rb --help` — ou `-h`)\n\n".blanc_sur_fond_rouge
  end

else



puts <<-HELP

  Ce script permet d'activer une analyse se trouvant dans le dossier
  `./_analyses_/`.

  USAGE
  -----
    #{'./analyse.rb "<Début_du_nom_de_dossier>"'.jaune}

    Note : si on se trouve dans le dossier principal de MuScaT, il faut
    faire `./utils/analyse.rb`.


    Le #{'<Début_du_nom_de_dossier>'} est le nom ou le début du nom
    du dossier dans le dossier général `_analyses_` qui devrait con-
    tenir toutes vos analyses MuScaT. Si plusieurs dossiers ont le
    même début, la commande permet de choisir lequel utiliser.

    Si aucun argument n'est mis, c'est la liste de tous les dossiers
    qui est présentée.

HELP

end #/if (help)
