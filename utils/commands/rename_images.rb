#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour renommer les fichiers du dossier donné en argument.
=end

unless OPTIONS[:help]
  begin

    # 'Mon texte'.essai
    # exit

    FOLDER      = ARGV.shift
    AFFIXE      = ARGV.shift || 'image'
    KSORT_NAME  = ARGV.shift == '-name'

    EXTENSIONS = %w{JPG jpg JPEG jpeg PNG png TIFF tiff}
    EXTENSIONS_STR = EXTENSIONS.join(',')
    FOLDER || raise(t('folder-images-required'))
    File.directory?(FOLDER) || raise(t('should-be-folder-path', {path: FOLDER.inspect}))
    img_files = Dir["#{FOLDER}/*.{#{EXTENSIONS_STR}}"]
    nombre_images = img_files.count
    nombre_images > 0 || raise('no-images-in-folder', {path: FOLDER, extensions: EXTENSIONS.join(', ')})

    # Les fichiers sont classés par date de modification
    if KSORT_NAME
      img_files.sort!
    else
      img_files.sort_by!{ |path| File.stat(path).mtime }
    end

    img_files.each_with_index do |src, idx|
      dst = File.join(FOLDER, "#{AFFIXE}-#{idx}#{File.extname(src)}")
      File.rename(src, dst)
      puts "#{File.basename(src)} -> #{File.basename(dst)}"
    end

    puts t('operation-successful').vert

  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'rename_images'}).blanc_sur_fond_rouge
    end
  end

else
  puts_help('rename_images')
end #/if (help)
