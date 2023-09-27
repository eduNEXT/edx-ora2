/**
 * Interface for staff assessment view.
 *
 * @param {Element} element - The DOM element representing the XBlock.
 * @param {OpenAssessment.Server} server - The interface to the XBlock server.
 * @param {OpenAssessment.BaseView} baseView - Container view.
 */
export class StaffView {
  constructor(element, server, baseView) {
    this.element = element;
    this.server = server;
    this.baseView = baseView;
    this.isRendering = false;
    this.announceStatus = false;
  }

  /**
     * Load the staff assessment view.
     * */
  load(usageID) {
    const view = this;
    const stepID = '.step--staff-assessment';
    const focusID = `[id='oa_staff_grade_${usageID}']`;
    view.isRendering = true;

    this.server.render('staff_assessment').done(
      (html) => {
        $('.step--staff-assessment', view.element).replaceWith(html);
        view.isRendering = false;
        view.installHandlers();
        view.baseView.announceStatusChangeToSRandFocus(stepID, usageID, false, view, focusID);
      },
    ).fail(() => {
      view.baseView.showLoadError('staff-assessment');
    });
  }

  /**
    Install event handlers for the view.
    * */
  installHandlers() {
    // Install a click handler for collapse/expand
    const view = this;
    this.baseView.setUpCollapseExpand($('.step--staff-assessment', this.element));

    // Install a click handler for the reset button
    $('.step--staff-assessment', this.element).find('.staff-waiting--001__assessment__retry_assessment_button').click(
      (eventObject) => {
        // Override default form submission
        eventObject.preventDefault();

        // Confirm dialog
        let isConfirmed = window.confirm("This will reset your assessment, are you sure?");

        // If user confirms (clicks "OK"), then continue with the rest of the logic
        if (isConfirmed) {
            // Obtain the values from the button's data attributes and store in an object
            let values = {
              userid: $(eventObject.target).data('userid'),
            };

            // Handle the click and send the object to your function
            view.selfReset(values);

            // Refreshing window
            window.location.reload(true);
            
        } else {
            // Optional: Handle the case where the user clicked "Cancel"
            console.log("Reset Cancelled.");
        }
      },
    );
  }

  // Call to server Student reset assessment fuction
  selfReset(data){
    const view = this;
    const { baseView } = this;
    const usageID = baseView.getUsageID();

    this.server.resetStudentAssessment(data);
  }

}

export default StaffView;
