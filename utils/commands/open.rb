#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour activer une analyse
=end
unless OPTIONS[:help] || FIRST_ARG.nil?
  begin
    case FIRST_ARG
    when 'manuel'
      if OPTIONS[:edit]
        pth = File.join(APPFOLDER,'Manuel','Manuel.md')
        `open -a Typora "#{pth}"`
      else
        pth = File.join(APPFOLDER,'Manuel','Manuel.pdf')
        `open "#{pth}"`
      end
    when 'manual'
      if OPTIONS[:edit]
        pth = File.join(LOCALES_FOLDER,'Manual','Manual.md')
        `open -a Typora "#{path}"`
      else
        pth = File.join(LOCALES_FOLDER,'Manual','Manual.pdf')
        `open "#{path}"`
      end
    when 'dev'
      puts "Pour lancer le développement, taper 'openmuscat'.".vert
    else
      # Sinon, on cherche à ouvrir l'analyse courante ou à
      # afficher la liste des analyses.
      require_relative 'analyse'
    end

  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'open'}).blanc_sur_fond_rouge
    end
  end

else
  puts_help('open')
end #/if (help)
