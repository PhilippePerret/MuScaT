#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour activer une analyse
=end
require 'io/console'
require 'fileutils'
require_relative 'required'

unless ARGV.include?('-h') || ARGV.include?('--help') || ARGV.empty?
  begin

    WHAT = ARGV.shift

    case WHAT.downcase
    when 'manuel'
      pth = File.join(APPFOLDER,'Manuel','Manuel.pdf')
      `open "#{pth}"`
    when 'manual'
      pth = File.join(LOCALES_FOLDER,'Manual','Manual.pdf')
      `open "#{path}"`
    else
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
        print t('which-folder')
        choix = STDIN.getch()
        puts ''
        if choix == 'q'
          raise
        end
        choix = choix.ord - 97
        analyse_folder = File.join(ANALYSES_FOLDER,names[choix])
      end

      ANALYSE_FOLDER  = analyse_folder
      ANALYSE_NAME    = File.basename(analyse_folder)

      if analyse_folder
        puts t('analysis-folder-chosen', {name: ANALYSE_NAME})
        # Pour activer une analyse, il suffit de modifier le fichier
        # analyse.js en racine

        # On ouvre le dossier de l'analyse dans le finder
        `open "#{ANALYSE_FOLDER}"`

      else
        puts t('unknown-folder')
      end

    end


  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'open'}).blanc_sur_fond_rouge
    end
  end

else
  puts_help('open')
end #/if (help)
