import {
    gzip
} from "zlib";
import {
    Spot
} from "gojs";

const testController = function ($scope) {

    $scope.text = 0

    $scope.add = function () {
        $scope.text++
    }
}

export default testController