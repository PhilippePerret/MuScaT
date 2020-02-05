# encoding: UTF-8
# Retourne le nom de l'analyse dans la ligne de commande
# Note : pour le moment, c'est le truc sans option. Les espaces sont
# remplacées par des traits plats
def analyse_name_in_args
  ARGV.each do |arg|
    arg.start_with?('-') && next
    return arg.gsub(/ /, '_')
  end
  return nil
end
