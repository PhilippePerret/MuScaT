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
        msgs << t('folder-built', {name: DST_FOLDER})
      else
        raise t('folder-unfound', {name: DST_FOLDER})
      end
    end

    # On exécute le changement
    `defaults write com.apple.screencapture location "#{DST_FOLDER}"`

    msgs << t('folder-captures-set', {name: DST_FOLDER})
    msgs = INDENT + msgs.join("\n#{INDENT}")
    puts "\n\n\n#{msgs}\n\n\n".vert

  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'change_folder_captures'}).blanc_sur_fond_rouge
    end
  end

else
  puts_help('change_folder_captures')
end #/if (help)
