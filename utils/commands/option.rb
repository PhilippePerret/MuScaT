# encoding: UTF-8
=begin

  Commande qui gère les options de l'analyse choisie

=end

analyse = Analyse.cible

analyse || raise('Analyse requise.')

analyse.options = analyse.options.merge(PARAMS)

# puts "Options de l'analyse '#{analyse.real_name}' enregistrées avec succès.".vert
puts "Nouvelle valeur : #{analyse.options.inspect}"

puts "Commande incomplète..."
