#!/usr/bin/env ruby
# encoding: UTF-8
=begin
  Script pour activer une analyse
=end

unless ARGV.include?('-h') || ARGV.include?('--help')
  begin
    analyse = Analyse.get_from_all
    if analyse
      Analyse.set_current(analyse)
    else
      raise t('unknown-folder')
    end
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
