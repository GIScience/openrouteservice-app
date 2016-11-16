angular.module('orsApp.ors-modal', []).component('orsModal', {
    template: `
			<div class="ors-modal-container">
				<form class="ors-dialog">
				<ng-transclude></ng-transclude>
				<button class="ors-button close" data-ng-click="$ctrl.showFn()"">
				    <i class="fa fa-lg fa-remove">
				    </i>
				</button>
				</form>
			</div>
    `,
    transclude: true,
    bindings: {
        showFn: '&',
    },
    controller() {
        let ctrl = this;
    }
});





