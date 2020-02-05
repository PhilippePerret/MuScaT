# encoding: UTF-8
class Analyse
class << self

  # L'analyse cible, soit fournie en argument, soit définie dans .cible
  def cible
    @cible ||= begin
      get_from_args || get_from_definition
    end
  end

  def current
    @current ||= Analyse.new(get_current_analyse)
  end


  # Retourne le nom de l'analyse courante (dans le fichier racine analyse.js)
  def get_current_analyse
    File.read(CUR_ANALYSE_FILE).match(/ANALYSE(?:.*?)=(?:.*?)"(.*?)"/).to_a[1]
  end

  # Retourne l'instance analyse d'après l'analyse spécifiée en ligne de
  # commande (deuxième argument). Le nom spécifié peut être partiel ou pas
  # +return+ [Analyse]
  def get_from_args
    Analyse.new(get_name_from_args)
  end

  # Retourne l'instance d'analyse d'après le fichier .cible s'il existe
  def get_from_definition
    if File.exists?(cible_path)
      require cible_path
      Analyse.new(CIBLE_NAME)
    end
  end

  def define_cible cible
    File.open(cible_path,'wb'){|f| f.write "CIBLE_NAME = '#{cible}'\n"}
  end

  # On retourne le nom de l'analyse (nom de son dossier) d'après le nom
  # fourni en argument de commande (il peut être partiel)
  def get_name_from_args

  end

  # Retourne la liste des noms d'analyse (les noms des dossiers)
  def names_list
    @names_list ||= Dir["#{ANALYSES_FOLDER}/*"].collect{|d| File.basename(d)}
  end

  def cible_path
    @cible_path ||= File.join(UTILS_FOLDER,'.cible.rb')
  end
end #/ << self
end #/ Analyse
