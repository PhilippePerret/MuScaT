#!/usr/bin/env ruby
# encoding: UTF-8
=begin

  Ce script permet d'être utilisé pour faire un alias dans son profil bash
  pour pouvoir utiliser une commande comme :

      > mus create "Ma nouvelle analyse"

=end
require_relative 'required'


# ---------------------------------------------------------------------
# TRAITEMENT DE LA LIGNE DE COMMANDE
COMMAND_LANG = {
  'aide':                     'help',
  'ouvre':                    'open',
  'créer':                    'create',
  'renommer_images':          'rename_images',
  'change_dossier_captures':  'change_folder_caputres'
}

# La commande
cmd = ARGV.shift
COMMAND = COMMAND_LANG[cmd] || cmd

if !COMMAND || COMMAND == 'help'
  # Afficher l'aide
  # puts "\033c"
  puts_help('run')
elsif File.exist?(File.join(APPFOLDER,'utils',"#{COMMAND}.rb"))
  # C'est bon, on peut le faire
  # On se place toujours dans l'application
  Dir.chdir(APPFOLDER) do
    require_relative COMMAND
  end

else
  puts (RC*2 + t('unknown-command', {command: COMMAND}) + RC*2).rouge
end
