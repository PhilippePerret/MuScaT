# frozen_string_literal:true
# encoding: UTF-8


APPFOLDER         = File.expand_path(File.dirname(__dir__))
ANALYSES_FOLDER   = File.join(APPFOLDER,'_analyses_')
PARTITION_PATH    = File.join(APPFOLDER,'_TABLE_ANALYSE_.html')
CUR_ANALYSE_FILE  = File.join(APPFOLDER,'analyse.js')

def analyse_name_in_args
  ARGV.each do |arg|
    arg.start_with?('-') && next
    return arg.gsub(/ /, '_')
  end
  return nil
end

def names_list
  @names_list ||= Dir["#{ANALYSES_FOLDER}/*"].collect{|d| File.basename(d)}
end

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
