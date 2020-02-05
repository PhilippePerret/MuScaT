# encoding: UTF-8
class Analyse

  attr_reader :name

  # On instancie une analyse avec le nom de son dossier
  def initialize folder_name
    @name = folder_name
  end

  # Nom réel
  def real_name
    @real_name ||= name.gsub(/[_\-]/,' ')
  end

  # Chemin d'accès absolu au dossier de l'analyse
  def path
    @path ||= File.join(ANALYSES_FOLDER,name)
  end

end #/Analyse
