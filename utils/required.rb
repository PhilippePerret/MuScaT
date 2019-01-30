# frozen_string_literal:true
# encoding: UTF-8

APPFOLDER         = File.expand_path(File.dirname(__dir__))
ANALYSES_FOLDER   = File.join(APPFOLDER,'_analyses_')
PARTITION_PATH    = File.join(APPFOLDER,'_TABLE_ANALYSE_.html')
CUR_ANALYSE_FILE  = File.join(APPFOLDER,'analyse.js')

INFOS_FILE        = File.join(APPFOLDER,'xlib','infos.rb')
LANG_FILE         = File.join(APPFOLDER,'xlib','locales','LANG')
LANG_JS_FILE      = File.join(APPFOLDER,'xlib','js','system','LANG.js')
LANG              = File.exist?(LANG_FILE) ? File.read(LANG_FILE).strip : 'en'
# puts "Langue: #{LANG}"
LOCALES_FOLDER    = File.join(APPFOLDER,'xlib','locales', LANG)

LOCALES_EN_FOLDER = File.join(APPFOLDER,'xlib','locales','en')

INDENT = '  '

RC = '
'

# Requérir les mots de la langue
require File.join(LOCALES_FOLDER,'locales')
# Requérir les infos
if File.exist?(INFOS_FILE)
  require INFOS_FILE
else
  INFOS = {
    editor: "TextMate",
    updated_at: nil,
    created_at: Time.now.to_i
  }
end


# Retourne le texte localisé en fonction de la langue
def t str_id, templates = nil
  templates ||= Hash.new
  LOCALES[str_id.to_s] % templates
end
def puts_help cmd_id
  pth = File.join(LOCALES_FOLDER,'command_helps',"#{cmd_id}.txt")
  File.exist?(pth) || pth = File.join(LOCALES_EN_FOLDER,'command_helps',"#{cmd_id}.txt")
  puts RC*4
  puts "#{"="*40} HELP/AIDE #{'='*40}"
  puts RC*4
  puts INDENT + eval('"'+File.read(pth).gsub(/"/, '\"')+'"').split(RC).join(RC + INDENT)
  puts RC*3
end

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
