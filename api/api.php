<?php
session_start();
require 'connection.php';
require 'connection.php';
require 'user.php';
require 'product.php';
require 'chat.php';
require 'highscore.php';
require 'search.php';
require 'login.php';
connect();

$requestParts = explode('/', $_GET['url']);
switch ($requestParts[0]) {
  case 'user':
    if($requestParts[1] == 'friends' && indexSet(2) && indexSet(3)) {
      if($requestParts[2] == 'get') {
        echo json_encode(getMutualFriends($requestParts[3]));
      }
      if($requestParts[2] == 'requests') {
        echo json_encode(getFriendRequests($requestParts[3]));
      }
      if($requestParts[2] == 'pending') {
        echo json_encode(getPendingFriends($requestParts[3]));
      }
    }
    if($requestParts[1] == 'info' && indexSet(2)) {
      if (indexSet(3)) {
        if($requestParts[3] == 'xml') {
          echo xml_encode(getUserInfo($requestParts[2]));
          break;
        }
      }
        echo '<pre>'.json_encode(getUserInfo($requestParts[2]),JSON_PRETTY_PRINT).'</pre>';
    }
    break;
  case 'highscore':
    /*if($requestParts[1] == 'set') {
      if (indexSet(2)) {
        if (indexSet(3)) {
          echo setHighscore($requestParts[2],$requestParts[3]);
        }
      }
    }*/
    if($requestParts[1] == 'get') {
      if (isset($_SESSION['id']) || indexSet(2)) {
        if (indexSet(2)) $userID = getUserID($requestParts[2]);
        else $userID = $_SESSION['id'];
        echo getHighscores($userID);
      }
    }
    break;
  case 'chat':
    if($requestParts[1] == 'get') {
      echo '<pre>'.getChat().'</pre>';
    }
    break;
  case 'products':
    if($requestParts[1] == 'get') {
      echo '<pre>'.getProducts().'</pre>';
    }
    break;
  // api/search/(query)
  case 'search':
    echo '<pre>'.searchUsers($requestParts[1]).'</pre>';
    break;
  case 'coins':
    if($requestParts[1] == 'get') {
      if (indexSet(2)) {
        echo getCoins(getUserID($requestParts[2]));
      }
    }
    break;
  default:
    echo 'Incorrect API request. Please consult the <a href="/api">documentation</a>!';
    break;
}
    function indexSet($index) {
      global $requestParts;
      if (array_key_exists($index,$requestParts)) {
        if ($requestParts[$index] == '') {
          return false;
        }
        return true;
      }
      return false;
    }

    function xml_encode($mixed, $domElement=null, $DOMDocument=null) {
    if (is_null($DOMDocument)) {
        $DOMDocument =new DOMDocument;
        $DOMDocument->formatOutput = true;
        xml_encode($mixed, $DOMDocument, $DOMDocument);
        echo $DOMDocument->saveXML();
    }
    else {
        if (is_array($mixed)) {
            foreach ($mixed as $index => $mixedElement) {
                if (is_int($index)) {
                    if ($index === 0) {
                        $node = $domElement;
                    }
                    else {
                        $node = $DOMDocument->createElement($domElement->tagName);
                        $domElement->parentNode->appendChild($node);
                    }
                }
                else {
                    $plural = $DOMDocument->createElement($index);
                    $domElement->appendChild($plural);
                    $node = $plural;
                    if (!(rtrim($index, 's') === $index)) {
                        $singular = $DOMDocument->createElement(rtrim($index, 's'));
                        $plural->appendChild($singular);
                        $node = $singular;
                    }
                }

                xml_encode($mixedElement, $node, $DOMDocument);
            }
        }
        else {
            $domElement->appendChild($DOMDocument->createTextNode($mixed));
        }
    }
}

?>
