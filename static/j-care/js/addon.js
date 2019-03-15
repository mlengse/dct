  ///<summary>
  /// This will check the result for messages. If there is an exception, then the page
  /// is redirected to an error page.  If there are errors, the error div class is ui-state-error.
  /// If there are no errors, then the error div class is ui-state-highlight.
  ///</summary>
  /// <param name="result">
  ///   This is the message holder.  It should have a Messages property and the messages should
  ///</param>
  function updateErrorDivFromResult(result, controlToUseForError, formToUse, urlException, errorDiv) {
    if(errorDiv == null || errorDiv.length == 0){
        errorDiv = ELEMENT_ERROR_DIV;
    }
    var validator = jQuery(formToUse).validate();
    var hasError = false;
    var hasException = false;
    var errorList = Object();
    var errorMessage = "";

    if (result.messages != null) {
      for (var loopCounter = 0; loopCounter < result.messages.length; loopCounter++) {
        if (result.messages[loopCounter].messageType == 'Exception') {
          hasException = true
          break;
        }

        if (result.messages[loopCounter].messageType == 'Error') {
          hasError = true;
        }
        
        errorMessage += result.messages[loopCounter].message + '<br/>';
      }

      if(!hasException) {
        errorList[controlToUseForError] = errorMessage;
        validator.showErrors(errorList);

        //This needed to set the class of the error div to not use the error class
        if (!hasError) {
          swapClassesForced(jQuery(errorDiv), 'ui-state-error', 'ui-state-highlight');
        }
        else {
          swapClassesForced(jQuery(errorDiv), 'ui-state-highlight', 'ui-state-error');
        }
      }
      else{
        fullRedirect(urlException);
      }
    }
  }

  function resetErrorStyle(errorDiv) {
    if(errorDiv == null || errorDiv.length == 0){
        errorDiv = ELEMENT_ERROR_DIV;
    }
    swapClassesForced(jQuery(errorDiv), 'ui-state-highlight', 'ui-state-error');
  }