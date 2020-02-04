# encoding: UTF-8

# Fichier définissant l'analyse courante
ANA_FILE = File.join(APP_FOLDER,'analyse.js')


def get_current_analyse_name
  # const ANALYSE="Beethoven-Sonate-8-Mvt-2"
  firstLine = File.read(ANA_FILE).split("\n").first
  analyse_name = firstLine.match(/ANALYSE ?= ?"(.*?)"/).to_a[1]
  Ajax << {analyse_name:analyse_name}
  analyse_name
end

ANALYSE_NAME = get_current_analyse_name
ANALYSE_FOLDER = File.join(APP_FOLDER,'_analyses_', ANALYSE_NAME)
ANALYSE_TAGS_JS = File.join(ANALYSE_FOLDER, '_tags_.js')
ANALYSE_BACKUP_FOLDER = File.join(ANALYSE_FOLDER, 'xbackups')
`mkdir -p "#{ANALYSE_BACKUP_FOLDER}"`
