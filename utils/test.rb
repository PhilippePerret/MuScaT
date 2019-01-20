#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  L'idée ici est de faire un petit module de test.

  Pour le lancer :

    - Se rendre dans ce dossier `utils`
    - jouer `test.rb` ou `test.rb chemin/vers/test/depuis/tests`
    - voir dans Firefox les résultats obtenus en console.

=end
require_relative 'required'
require 'fileutils'

begin
  # Inscription de tous les fichiers de tests (système et tests) dans
  # le corps de partition.html (renommé 'test.html')
  PARTITION_PATH  = File.expand_path('../template/partition.html')
  TEST_FILE_PATH  = File.expand_path('../template/test.html')
  FOLDER_TESTS    = File.expand_path('../template/tests')

  # On récupère tous les fichiers js système
  all_js_tags = Dir["#{FOLDER_TESTS}/system/**/*.js"].collect do |pth|
    '<script type="text/javascript" src="%s"></script>' % [pth.sub(/^#{FOLDER_TESTS}/,'./tests/')]
  end
  # On récupère les feuilles de tests
  paths_tests = nil
  if ARGV.first
    path_test = File.join(FOLDER_TESTS,'tests',ARGV.first)
    path_test_file = path_test
    path_test_file.concat('.js') unless path_test.end_with?('.js')
    if File.exist?(path_test) && File.directory?(path_test)
      paths_tests = Dir["#{path_test}/**/*.js"].shuffle
    elsif File.exist?(path_test_file)
      paths_tests = [path_test_file]
    else
      raise "Le fichier test désigné est introuvable (#{ARGV.first.inspect})"
    end
  end
  paths_tests ||= Dir["#{FOLDER_TESTS}/tests/**/*.js"].shuffle

  all_js_tags += paths_tests.collect do |pth|
    '<script type="text/javascript" src="%s"></script>' % [pth.sub(/^#{FOLDER_TESTS}/,'./tests/')]
  end

  # puts all_js_tags.join("\n")

  FileUtils.copy(PARTITION_PATH, TEST_FILE_PATH)
  code = File.read(TEST_FILE_PATH)
  code = code.sub(/<\!-- TESTS -->/, all_js_tags.join(RC))
  code = code.sub(/<\/title>/, '- TESTS</title>')
  File.open(TEST_FILE_PATH,'wb'){|f|f.write code}

  # Ouverture du fichier test.html pour lancer le test
  if ARGV.include?('-o') || ARGV.include?('--open')
    `open -a Firefox "#{TEST_FILE_PATH}"`
  else
    puts '
  Ajouter l’option `-o` (à la fin) pour ouvrir la première fois
  le fichier dans Firefox (et consultez la console).'.vert
  end

  puts '
  Maintenant, vous pouvez modifier le test (le fichier javascript)
  pour le développer, et recharger simplement la page pour le
  lancer.

  '.vert


rescue Exception => e
  puts "\n\n  #{e.message.rouge}\n\n"
end
