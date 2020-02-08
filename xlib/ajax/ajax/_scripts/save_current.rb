# encoding: UTF-8
=begin

  Script qui sauve le code de l'analyse courante

=end

code  = Ajax.arg(:code)

begin
  # On vérifie d'abord que le code soit conforme
  code.include?('A.version=') || raise("Le code devrait contenir 'A.version='…")
  code.include?('A.lines=')   || raise("Le code devrait contenir 'A.lines='…")
  now = Time.now.to_i

  if File.exists?(ANALYSE_TAGS_JS)
    dst = File.join(ANALYSE_BACKUP_FOLDER, "tags-#{now}.js")
    FileUtils.move(ANALYSE_TAGS_JS, dst)
  end

  # On enregistre le nouveau code
  File.open(ANALYSE_TAGS_JS,'wb'){|f| f.write code}

  Ajax << {success: "- Code sauvé avec succès -"}

rescue Exception => e

  Ajax << {error: "#{e.message}. Je ne l'enregistre pas."}

end
