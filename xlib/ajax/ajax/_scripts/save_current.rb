# encoding: UTF-8
=begin

  Script qui sauve le code de l'analyse courante

=end

code = Ajax.arg(:code)

begin
  # On vérifie d'abord que le code soit conforme
  code.include?('Tags = ') || raise("Le code devrait contenir 'Tags = '")
  code.include?('options(') || raise("Le code devrait définir 'options(...)'")

  # On commence par faire une copie du fichier _tags_.js actuel dans le backup
  dst = File.join(ANALYSE_BACKUP_FOLDER, "_tags_-#{Time.now.to_i}.js")
  FileUtils.move(ANALYSE_TAGS_JS, dst)

  # On enregistre le nouveau code
  File.open(ANALYSE_TAGS_JS,'wb'){|f| f.write code}

  Ajax << {success: "- Code sauvé avec succès -"}

rescue Exception => e

  Ajax << {error: "#{e.message}. Je ne l'enregistre pas."}

end
