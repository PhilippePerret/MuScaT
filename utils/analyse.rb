#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour activer une analyse
=end
require 'io/console'
require 'fileutils'
require_relative 'required'

def get_current_analyse
  File.read(CUR_ANALYSE_FILE).match(/ANALYSE(?:.*?)=(?:.*?)"(.*?)"/).to_a[1]
end

unless ARGV.include?('-h') || ARGV.include?('--help')
  begin

    # On cherche le nom donné en argument
    analyse_name    = nil
    analyse_folder  = nil

    analyse_name = analyse_name_in_args

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
        puts t('no-folder-found', {name: analyse_name}).vert
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
      puts RC*2 + "#{t('currente')} #{get_current_analyse}"
      print t('which-folder')
      choix = STDIN.getch()
      puts ''
      if choix.to_s.strip == ''
        choix = nil # pour plus bas
      elsif choix == 'q'
        raise
      else
        choix = choix.ord - 97
        analyse_folder = File.join(ANALYSES_FOLDER,names[choix])
      end
    end

    if choix == nil
      # Rien à faire, c'est l'ouverture de la dernière analyse
    else
      ANALYSE_FOLDER    = analyse_folder
      ANALYSE_NAME      = File.basename(analyse_folder)
      ANALYSE_TAGS_FILE = File.join(ANALYSE_FOLDER,'_tags_.js')

      if analyse_folder
        puts t('analysis-folder-chosen', {name: ANALYSE_NAME.inspect})
        # Pour activer une analyse, il suffit de modifier le fichier
        # analyse.js en racine
        File.open(CUR_ANALYSE_FILE,'wb'){|f|f.write("const ANALYSE=\"#{ANALYSE_NAME}\";")}
      else
        puts 'unknown-folder'
      end
    end
    # On ouvre l'analyse
    `open -a "Google Chrome" "#{PARTITION_PATH}"`
    # On ouvre le fichier _tags_.js s'il ne faut
    if ARGV.include?('-t') || ARGV.include?('--tags')
      `open -a #{INFOS[:editor]} #{ANALYSE_TAGS_FILE}`
    end



  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'analyse'}).blanc_sur_fond_rouge
    end
  end

else
  puts_help('analyse')
end #/if (help)
