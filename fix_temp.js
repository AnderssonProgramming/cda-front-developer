// Temporary fix for language selector
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    console.log('🔧 Applying language selector fix...');
    
    // Force re-initialize language selector
    const languageOptions = document.querySelectorAll('.language-selector__option');
    const languageToggle = document.querySelector('.language-selector__toggle');
    const languageMenu = document.querySelector('.language-selector__dropdown');
    
    if (languageOptions.length && languageToggle && languageMenu) {
      console.log(`✅ Found ${languageOptions.length} language options`);
      
      // Remove all existing listeners by cloning elements
      languageOptions.forEach(option => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
        
        // Add fresh event listener
        newOption.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const newLanguage = newOption.getAttribute('data-lang');
          console.log(`🔄 Changing language to: ${newLanguage}`);
          
          if (window.app && window.app.languageManager) {
            window.app.languageManager.changeLanguage(newLanguage);
          } else if (typeof changeLanguage === 'function') {
            changeLanguage(newLanguage);
          } else {
            console.error('❌ No language change function available');
            alert(`Language change to ${newLanguage} - Please reload page`);
          }
          
          // Close dropdown
          languageMenu.setAttribute('hidden', '');
          languageMenu.classList.remove('language-selector__dropdown--open');
          languageToggle.setAttribute('aria-expanded', 'false');
        });
      });
      
      console.log('✅ Language selector fix applied');
    } else {
      console.error('❌ Language selector elements not found');
    }
  }, 1000);
});
