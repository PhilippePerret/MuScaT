#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour renommer les fichiers du dossier donné en argument.
=end
INFOS_CODE = <<-EOT
INFOS = {
  analyse_name:     "%{analyse_name}",
  author:           "#{File.basename(Dir.home)}",
  created_at:       #{Time.now.to_i},
  muscat_version:   "#{File.read(File.join(APPFOLDER,'xlib','VERSION')).strip}"
}
EOT
unless ARGV.include?('-h') || ARGV.include?('--help')
  begin

    # On s'assure qu'un nom ait été donné
    analyse_name = nil
    ARGV.each do |arg|
      unless analyse_name || arg.start_with?('-')
        analyse_name = arg
        break
      end
    end

    analyse_name || raise(t('analysis-name-required'))

    analyse_name = analyse_name.gsub(/[  \t]/,'_')

    # On s'assure d'abord que les dossiers existe
    unless File.exist?(ANALYSES_FOLDER)
      `mkdir -p "#{ANALYSES_FOLDER}"`
      puts t('analysis-folder-built')
    end

    ANALYSE_FOLDER  = File.join(ANALYSES_FOLDER,analyse_name)
    # puts t('analysis-folder', {name: ANALYSE_FOLDER})
    if File.exist?(ANALYSE_FOLDER)
      raise t('analysis-folder-already-exists')
    end
    TEMPLATE_FOLDER = File.join(ANALYSES_FOLDER,'Template')

    FileUtils.cp_r("#{TEMPLATE_FOLDER}/", ANALYSE_FOLDER)

    analyse_tags_file = File.join(ANALYSE_FOLDER,'analyse.js')
    File.open(analyse_tags_file,'wb'){|f| f.write('const ANALYSE="%s";' % [analyse_name])}
    infos_file = File.join(ANALYSE_FOLDER,'.infos.rb')
    File.open(infos_file,'wb'){|f|f.write(INFOS_CODE % {analyse_name: analyse_name})}

    if ARGV.include?('-o') || ARGV.include?('--open')
      `open "#{analyse_folder}"`
    end

    puts t('create-confirmation', {name: analyse_name}).vert

  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'create'}).blanc_sur_fond_rouge
    end
  end

else
  puts_help('create')
end #/if (help)
