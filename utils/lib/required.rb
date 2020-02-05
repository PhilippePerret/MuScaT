# frozen_string_literal:true
# encoding: UTF-8


# Requérir d'abord toutes les constantes
require_relative 'required/constants'

# Requérir tous les modules du fichier required
Dir["#{REQUIRED_FIRST_FOLDER}/**/*.rb"].each{|m|require m}
Dir["#{REQUIRED_THEN_FOLDER}/**/*.rb"].each{|m|require m}
