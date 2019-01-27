#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour activer une analyse
=end
require 'io/console'
require 'fileutils'
require_relative 'required'

WHAT = ARGV.shift

unless ARGV.include?('-h') || ARGV.include?('--help')
  begin

    case WHAT.downcase
    when 'manuel'
      pth = File.join(APPFOLDER,'Manuel','Manuel.pdf')
      `open "#{pth}"`
    else
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
        analyse_folder = File.join(ANALYSES_FOLDER,analyse_name)
      else
        # Mauvais nom ou
        names = Array.new
        names_list.each do |name|
          if name.start_with?(analyse_name)
            names << name
          end
        end
        if names.count == 1
          analyse_folder = File.join(ANALYSES_FOLDER,names.first)
        elsif names.count == 0
          puts "Aucun dossier d'analyse n'a été trouvé avec « #{analyse_name} »".vert
          names = names_list
          analyse_folder = nil
        end
      end

      unless analyse_folder
        # Quand il faut choisir
        puts "\n\n"
        names.each_with_index do |aname, idx|
          puts "    #{(97+idx).chr}: #{aname}"
        end
        puts "\n\n"
        print "Quel dossier choisir (lettre) ? ('q' pour renoncer)"
        choix = STDIN.getch()
        puts ''
        if choix == 'q'
          exit 1
        end
        choix = choix.ord - 97
        analyse_folder = File.join(ANALYSES_FOLDER,names[choix])
      end

      ANALYSE_FOLDER  = analyse_folder
      ANALYSE_NAME    = File.basename(analyse_folder)

      if analyse_folder
        puts "Vous avez choisi le dossier d'analyse : #{ANALYSE_NAME.inspect}"
        # Pour activer une analyse, il suffit de modifier le fichier
        # analyse.js en racine

        # On ouvre le dossier de l'analyse dans le finder
        `open "#{ANALYSE_FOLDER}"`

      else
        puts "Dossier inconnu, je ne peux rien faire pour vous…"
      end

    end


  rescue Exception => e
    puts "\n\n\tERREUR: #{e.message}\n\n(pour obtenir de l'aide, jouez `./analyse.rb --help` — ou `-h`)\n\n".blanc_sur_fond_rouge
  end

else



puts <<-HELP

  Ce script permet d'ouvrir le dossier d'une analyse se trouvant dans
  le dossier `./_analyses_/`.
  Ou le manuel avec la commande :

    #{'./open.rb manuel'.jaune}

  USAGE
  -----
    #{'./open.rb "<Début_du_nom_de_dossier>"'.jaune}

    (avec l'alias `mus`)  > mus open "début du nom"
                          > mus ouvre "Début du nom"

    Note : si on se trouve dans le dossier principal de MuScaT, il faut
    faire `./utils/open.rb`.


    Le #{'<Début_du_nom_de_dossier>'} est le nom ou le début du nom
    du dossier dans le dossier général `_analyses_` qui devrait con-
    tenir toutes vos analyses MuScaT. Si plusieurs dossiers ont le
    même début, la commande permet de choisir lequel utiliser.

    Si aucun argument n'est mis, c'est la liste de toutes les analy-
    qui est présentée, pour en choisir une.

HELP

end #/if (help)
