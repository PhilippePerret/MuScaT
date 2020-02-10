# encoding: UTF-8
=begin

  Commande qui gère les options de l'analyse choisie

=end
WIDTH_OPTION_KEY = 24

unless OPTIONS[:help]

  begin

    analyse = Analyse.cible

    analyse || raise('Analyse requise.')

    analyse.options.each do |key, value|
      puts "\t#{key.ljust(WIDTH_OPTION_KEY,'.')} #{value.inspect}"
    end

    # S'il faut afficher toutes les options
    if OPTIONS[:all]
      puts "\n\n\nAutres options"
      puts       "==============\n\n"
      ANALYSIS_OPTIONS.each do |key, data|
        next if analyse.options.key?(key)
        puts "\t#{(key+' ').ljust(WIDTH_OPTION_KEY,'.')} #{t("option-#{key}")}"
      end
    end
    puts "\n\n\n"

    # analyse.options = analyse.options.merge(PARAMS)
    new_options = analyse.options.merge(PARAMS)

    # puts "Options de l'analyse '#{analyse.real_name}' enregistrées avec succès.".vert
    puts "Nouvelle valeur : #{analyse.options.inspect}"

    puts "Commande incomplète..."

  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'set'}).blanc_sur_fond_rouge
    end
  end

else
  puts_help('options')
end #/if (help)
