# encoding: UTF-8
=begin

  Commande qui gère les options de l'analyse choisie

=end
WIDTH_OPTION_KEY = 24

def analyse
  @analyse ||= Analyse.cible
end

# Vérifie que l'option de valeur +val+ et de données absolutes +data+
# soit conforme
def check_type_of key, val
  data = ANALYSIS_OPTIONS[key]
  case data[:type]
  when :integer
    if val.to_s.gsub(/\-?[0-9]/,'') != ''
      return [nil, t('option-error-bad-integer', {sujet:key, value:val.inspect})]
    end
    val = val.to_i
    # si une valeur max est fixée
    if data[:max] && val > data[:max]
      return [nil, t('option-error-integer-to-big', {sujet:key, expected:data[:max], actual:val})]
    end
    # si une valeur min est fixée
    if data[:min] && val < data[:min]
      return [nil, t('option-error-integer-to-small', {sujet:key, expected:data[:min], actual:val})]
    end
  when :string
    # si une longueur est fixée
    if data[:length] && val.length != data[:length]
      return [nil, t('option-error-string-bad-length', {sujet:key, expected:data[:length], actual:val.length})]
    end
  when :boolean
    case val
    when 'false', false
      return [false, nil]
    when 'true', true
      return [true, nil]
    else
      return [nil, t('option-error-boolean-required', {sujet:key, value:val})]
    end
  end
  return [val, nil]
end #/check_type_of

def save_new_options opts
  analyse.options = analyse.options.merge(opts)
  code = "A.options =#{RC}#{analyse.options.to_json}"
  File.open(analyse.path_options_js,'wb'){|f| f.write code}
  notice (t('options-saved', {options: analyse.options.inspect, name:analyse.name}))
end #/ save_new_options


unless OPTIONS[:help]

  begin

    analyse || raise('Analyse requise.')

    titre = "Options de l'analyse de #{analyse.name}"
    puts "\n\n\n"
    puts titre
    puts "=" * titre.length

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

    puts "Pour afficher toutes les options : #{'mus option --all'.jaune}"
    puts "Pour régler une valeur : #{'muscat option <nom-option>=<valeur>'.jaune}"

    if PARAMS.length > 0
      # Des paramètres ont été ajoutés, on vérifie que ce sont bien des options
      # valides. Il faut que la clé existe et que la valeur soit du bon type.
      good_options = {} # contiendra les bonnes valeurs à enregistrer
      PARAMS.each do |key, val|
        if ANALYSIS_OPTIONS.key?(key)
          # <= La table des options connait cette clé
          # => On vérifie si cette valeur est bonne et on la consigne le
          #     cas échéant.
          res = check_type_of(key, val)
          if res.last.nil? # <= ok
            good_options.merge!(key => res.first)
          else
            error res.last
          end
        else
          error "L’option #{key}' est inconnue. Je la passe."
        end
      end

      if good_options.length > 0
        # <= Des valeurs correctes ont été trouvées
        # => On les enregistre
        save_new_options(good_options)
      end
    end

  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'set'}).blanc_sur_fond_rouge
    end
  end

else
  puts_help('options')
end #/if (help)

if $0 == __FILE__
  puts "C'est ce fichier qui est joué"
end
