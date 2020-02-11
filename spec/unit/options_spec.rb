describe 'Options' do
  before(:all) do
    require './utils/commands/options'
  end

  describe 'la méthode check_type_of' do
    it 'retourne une erreur avec un mauvais nombre' do
      res = check_type_of('animation-speed', 'ffr')
      expect(res.first).to be_nil
      expect(res.last).to eq t('option-error-bad-integer', {sujet:'animation-speed', value:'ffr'.inspect})
    end
    it 'retourne une erreur avec un nombre trop petit' do
      res = check_type_of('animation-speed', '-1')
      expect(res.first).to be_nil
      expect(res.last).to eq t('option-error-integer-to-small', {sujet:'animation-speed', actual:-1, expected:1})
    end
    it 'retourne une erreur avec un nombre trop grand' do
      res = check_type_of('animation-speed', '101')
      expect(res.first).to be_nil
      expect(res.last).to eq t('option-error-integer-to-big', {sujet:'animation-speed', actual:101, expected:100})
    end
    it 'retourne une erreur avec un string de mauvaise longueur' do
      res = check_type_of('lang', 'ffr')
      expect(res.first).to be_nil
      expect(res.last).to eq t('option-error-string-bad-length', {sujet:'lang', expected:2, actual:3})
    end
    it 'retourne une erreur avec un mauvais booléen' do
      res = check_type_of('auto-save', 'nil')
      expect(res.first).to be_nil
      expect(res.last).to eq t('option-error-boolean-required',{sujet:'auto-save', value:'nil'})
    end

    # Les succès
    it 'retourne une validité avec un nombre correct (ni trop grand ni trop petit)' do
      res = check_type_of('animation-speed', '12')
      expect(res.first).to eq 12
      expect(res.last).to be_nil
    end
    it 'retourne une validité avec une bonne valeur booléenne' do
      res = check_type_of('auto-save', 'true')
      expect(res.first).to eq(true)
      expect(res.last).to be_nil
      res = check_type_of('auto-save', 'false')
      expect(res.first).to eq(false)
      expect(res.last).to be_nil
    end
    it 'retourne une validité avec une bonne valeur string (de la longueur attendue)' do
      res = check_type_of('lang', 'en')
      expect(res.first).to eq 'en'
      expect(res.last).to be_nil
    end
  end # / test de la méthode check_type_of

  describe 'enregistrement des options (save_new_options)' do
    before(:all) do
      Analyse.set_current('Tests')
    end
    it 'la méthode save_new_options enregistre les options' do
      # On change déjà les options
      File.unlink(analyse.path_options_js) if File.exists?(analyse.path_options_js)
      expect(File.exists?(analyse.path_options_js)).to eq false
      save_new_options({'auto-save' => true, 'coordonates' => false, 'lang'=>'en'})
      expect(File.exists?(analyse.path_options_js)).to eq true
      line_option = File.read(analyse.path_options_js).force_encoding('utf-8').split(RC)[1]
      options = JSON.parse(line_option)
      expect(options).to have_key 'auto-save'
      expect(options['auto-save']).to eq true
      expect(options).to have_key 'coordonates'
      expect(options['coordonates']).to eq false
      expect(options).to have_key 'lang'
      expect(options['lang']).to eq 'en'
    end
  end
end
