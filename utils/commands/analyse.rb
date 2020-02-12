#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour activer une analyse
=end

unless OPTIONS[:help]
  begin
    if OPTIONS[:list]
      analyse = Analyse.ask_for_analyse
      analyse || raise
    else
      analyse = Analyse.get_from_all
      unless analyse
        raise t('unknown-folder')
      end
    end
    Analyse.set_current(analyse)

    # On ouvre l'analyse
    # ------------------
    `open -a "Google Chrome" http://localhost/Muscat/index.html`
  rescue Exception => e
    unless e.message.empty?
      puts t('fatal-error', {err_msg: e.message, command: 'analyse'}).blanc_sur_fond_rouge
    end
  end

else
  puts_help('analyse')
end #/if (help)
