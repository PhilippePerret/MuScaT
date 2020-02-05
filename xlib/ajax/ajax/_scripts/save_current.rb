# encoding: UTF-8
=begin

  Script qui sauve le code de l'analyse courante

=end

code  = Ajax.arg(:code)   # Ancienne version
lines = Ajax.arg(:lines)  # Nouvelle version (json)

begin
  # On vérifie d'abord que le code soit conforme
  code.include?('Tags = ') || raise("Le code devrait contenir 'Tags = '")

  ANALYSE_TAGS_JSON
  if File.exists?(ANALYSE_TAGS_JSON)
    dst = File.join(ANALYSE_BACKUP_FOLDER, "tags-#{now}.json")
    FileUtils.move(ANALYSE_TAGS_JSON, dst)
  end

  if File.exists?(ANALYSE_TAGS_JS)
    # Ancienne formule
    # On commence par faire une copie du fichier _tags_.js actuel dans le backup
    dst = File.join(ANALYSE_BACKUP_FOLDER, "_tags_-#{Time.now.to_i}.js")
    FileUtils.move(ANALYSE_TAGS_JS, dst)
  end

  # On enregistre le nouveau code
  File.open(ANALYSE_TAGS_JS,'wb'){|f| f.write code}
  File.open(ANALYSE_TAGS_JSON, 'wb'){|f| f.write lines.to_json}

  Ajax << {success: "- Code sauvé avec succès -"}

rescue Exception => e

  Ajax << {error: "#{e.message}. Je ne l'enregistre pas."}

end
