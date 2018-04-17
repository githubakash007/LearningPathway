export enum LearnerApiName {
    getCurriculum = <any>'curriculum/',
    addElectiveCourse = <any>'courses/add/',
    removeElectiveCourse = <any>'',
    getEnrichmentCourses = <any>'courses/enrichment/',
    submitCurriculum = <any>'save/',
    getEmployeeInfo = <any>'employee',
    SearchEnrichmentCourse = <any>'courses/search/',
    getEmployeeListForApproval = <any>'myapproval/employeelist/',
    getCurrentEmployeeDetails = <any>'myapproval/selectedcourses/',
    submitSuggestChanges = <any>'myapproval/reject/',
    approveCourseSelection = <any>'myapproval/approve/',
    resetPathway = <any>'reset/',
    SearchFunctionalCourse = <any>'courses/searchfunctional/',
    addFunctionalElectiveCourse = <any>'courses/functionalcourseadd/', //Not used
}