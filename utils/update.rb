#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour renommer les fichiers du dossier donné en argument.
=end
require_relative 'required'

WHAT =  unless ['-h','--help'].include?(ARGV.first)
          ARGV.shift
        else
          nil
        end

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
      puts t('export-to-pdf').vert
    end
  rescue Exception => e
    puts t('fatal-error', {err_msg: e.message, command: 'update'}).blanc_sur_fond_rouge
  end

else

  puts_help('update')

end #/if (help)
