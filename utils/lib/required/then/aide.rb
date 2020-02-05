# encoding: UTF-8
def puts_help cmd_id
  pth = File.join(LOCALES_FOLDER,'command_helps',"#{cmd_id}.txt")
  File.exist?(pth) || pth = File.join(LOCALES_EN_FOLDER,'command_helps',"#{cmd_id}.txt")
  puts RC*4
  puts "#{"="*40} HELP/AIDE #{'='*40}"
  puts RC*4
  puts INDENT + eval('"'+File.read(pth).gsub(/"/, '\"')+'"').split(RC).join(RC + INDENT)
  puts RC*3
end
