# encoding: UTF-8
require 'cgi'
require 'json'

class Ajax
  class << self

    def treate_request
      STDOUT.write "Content-type: application/json; charset:utf-8;\n\n"
      STDOUT.write '{"message": "en dur"}'+"\n"
    end

    # Envoi du code
    def output
      STDOUT.write "Content-type: application/json; charset:utf-8;\n\n"
      begin
        STDOUT.write '{"message": "en dur"}'+"\n"
        # STDOUT.write (data || Hash.new).to_json
      rescue Exception => e
        # Parfois, le code ne peut pas être traduit, à cause de
        # ce PU***N de problème d'encodage US8bit vers UTF8
        fdata = force_encoding(data, 'utf-8')
        STDOUT.write fdata.to_json
      end
    end

    def force_encoding foo, format
      case foo
      when String then foo.force_encoding(format)
      when Hash   then force_encoding_hash(foo, format)
      when Array  then force_encoding_array(foo, format)
      else foo
      end
    end
    def force_encoding_hash hash, format
      newh = Hash.new
      hash.each do |k, v|
        v = force_encoding(v, format)
        newh.merge!(k => v)
      end
      return newh
    end
    def force_encoding_array foo, format
      foo.collect { |v| force_encoding(v, format) }
    end

    # Ajoute une donnée à retourner
    #
    # TODO Plus tard, faire un merge "intelligent" avec les messages,
    # pour que les nouveaux messages ou erreurs n'écrasent pas les
    # messages ou erreurs existants.
    def << hdata
      @data ||= Hash.new
      @data.merge!( hdata )
    end

    # Données à retourner à la requête
    def data
      @data ||= Hash.new
      # # S'il y a des messages, il faut les ajouter
      # if app.notice.output != ''
      #   flash @data[:message] if @data.key?(:message)
      #   @data.merge!(message: app.notice.output)
      # end
      # if app.error.output != ''
      #   error @data[:error] if @data.key?(:error)
      #   @data.merge!(error: app.error.output)
      # end
      return @data
    end

  end # /<< self
end #/Ajax

begin
  # require './lib/_required'

  suivi = Array.new

  cgi = CGI.new('html4')

  puts cgi.params
  # Paramètres envoyés par la requête ajax
  # site.instance_variable_set("@cgi_values_decomplexed", true)
  # site.custom_params= JSON.parse(site.cgi.params.keys[0], symbolize_names: true)

  Ajax << {'Paramètres transmis' => cgi.params}

  # Pour le moment, on obtient des choses en appelant un script
  # params[:script] && require(params[:script])
  # param(:script) && require(param(:script))

  # Ajax << {suivi: suivi}
  Ajax.output
  # Note : Le programme ne passera en fait jamais par ici
rescue Exception => e
  STDOUT.write "Content-type: application/json; charset:utf-8;\n\n"
  error = Hash.new
  error.merge!(error: Hash.new)
  error[:error].merge!(message: e.message)
  error[:error].merge!(backtrace: e.backtrace)
  STDOUT.write error.to_json
end
