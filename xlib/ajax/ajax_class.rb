# encoding: UTF-8
require 'cgi'
require 'json'

class Ajax
  class << self

    def treate_request
      STDOUT.write "Content-type: application/json; charset:utf-8;\n\n"


      # TODO Jouer le script avec les paramètres

      # On ajoute au retour, le script joué et les clés envoyés en
      # paramètres CGI
      self << {
        'ran_script': script,
        'transmited_keys': cgi.params.keys.join(', ')
      }
      # Débug : pour voir ce que reçoit
      # self << {
      #   # params: cgi.params.inspect,
      #   script: script,
      #   args: args,
      #   message: message
      # }
      STDOUT.write data.to_json+"\n"
    rescue Exception => e
      STDOUT.write "Erreur survenue : #{e.message}"+"\n"
    end

    # Pour ajouter des données à renvoyer
    def << hashdata
      @data ||= {}
      @data.merge!(hashdata)
    end


    # ---------------------------------------------------------------------
    def data
      @data ||= {}
    end
    def script
      @script ||= cgi.params['script'][0]
    end

    def args
      @args ||= JSON.parse(cgi.params['args'][0])
    end

    def cgi
      @cgi ||= CGI.new('html4')
    end

  end #/ << self
end
