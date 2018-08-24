angular.module("orsApp.ors-modal", []).component("orsModal", {
  template: `
			<div class="ors-modal-container" ng-show="$ctrl.show">
				<form class="ors-dialog">
				<ng-transclude></ng-transclude>
				<button class="ors-button close" data-ng-click="$ctrl.show = !$ctrl.show">
				    <i class="fa fa-lg fa-remove">
				    </i>
				</button>
				</form>
			</div>
    `,
  transclude: true,
  bindings: {
    show: "="
  },
  controller() {
    let ctrl = this;
  }
});
