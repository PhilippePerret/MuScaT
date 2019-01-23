# frozen_string_literal:true
# encoding: UTF-8
class String
def jaune
  "\033[0;93m#{self}\033[0m"
end
def vert
  "\033[0;92m#{self}\033[0m"
end
def mauve
  "\033[0;94m#{self}\033[0m"
end
def rouge
  "\033[0;31m#{self}\033[0m"
end
def rouge_vif
  "\033[0;91m#{self}\033[0m"
end
def blanc_sur_fond_rouge
  "\033[0;41m#{self}\033[0m"
end
def gris
  "\033[0;90m#{self}\033[0m"
end
def essai
  (1..100).each do |i|
    puts "\033[0;#{i}m#{i}: #{self}\033[0m"
  end
end
end

INDENT = '  '

RC = '
'

APPFOLDER = File.expand_path(File.dirname(__dir__))
puts "APPFOLDER: #{APPFOLDER}"
ANALYSES_FOLDER = File.join(APPFOLDER,'_analyses_')
TABLE_FOLDER    = File.join(APPFOLDER, '_table_analyse_')
