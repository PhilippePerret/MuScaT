#!/usr/bin/env ruby
# encoding: UTF-8
=begin

  Pour voir la liste de toutes les commandes et obtenir un
  aperçu de la commande.

=end
def apercu_command command_name
  apercu_path = File.join(LOCALES_FOLDER,'commands_overview',"#{command_name}.txt")
  if File.exists?(apercu_path)
    File.read(apercu_path).force_encoding('utf-8')
  else
    return ''
  end
end

unless ARGV.include?('-h') || ARGV.include?('--help') || ARGV.empty?
  begin

    # On fait la liste des commandes de ce dossier en récupérant leur
    # aperçu rapide
    puts "\n\n\n"
    puts "-"* 70
    puts t('title-commands-list').jaune
    puts "=" * t('title-commands-list').length
    puts "\n\n"
    Dir["#{COMMANDS_FOLDER}/*.rb"].each do |command_path|
      command_name = File.basename(command_path, File.extname(command_path))
      puts "  " + command_name.jaune
      puts apercu_command(command_name)
    end
    puts "-"* 70
    puts t('help-commands-overview')
    puts "\n\n\n"

  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'set'}).blanc_sur_fond_rouge
    end
  end
else
  puts_help('set')
end
