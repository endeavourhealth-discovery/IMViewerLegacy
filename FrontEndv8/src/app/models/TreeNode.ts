export class TreeNode {
  constructor(public id: string,
              public name: string,
              public level = 1,
              public expandable = false,
              public parentNode: TreeNode = null,
              public isLoading = false,
              public page = 1) {}
}
