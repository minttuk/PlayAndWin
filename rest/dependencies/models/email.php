<?php

date_default_timezone_set('Etc/UTC');

/**
 * Send an email
 *
 * @param string $email the email address to send the message to;
 * @param string $username the user name of the email recipient
 * @param string $context the subject matter of the email (a specific string)
 * @param string $friendname the user name of the recipient's friend (optional)
 * @return string Success or error message
 */

function sendEmail($email,$username,$context,$friendname='') {
    $content = constructBody($context,$username,$friendname);

    $mail = new PHPMailer;
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );
    $mail->Host        = "smtp.zoho.com";
    $mail->SMTPDebug   = 0;
    $mail->SMTPAuth    = TRUE;
    $mail->SMTPSecure  = "tls";
    $mail->Port        = 587;
    $mail->Username    = 'support@playtalk.win';
    $mail->Password    = '4swWweJk0ACX';
    $mail->Priority    = 1;
    $mail->ContentType = 'text/html; charset=utf-8\r\n';
    $mail->Subject     = $content['subject'];
    $mail->IsSMTP();
    $mail->IsHTML(true);
    $mail->setFrom('support@playtalk.win', 'PlayTalk.Win');
    $mail->addAddress($email, $username);
    $mail->msgHTML($content['body']);

    if (!$mail->send()) {
        echo "Mailer Error: " . $mail->ErrorInfo;
    } else {
        echo "Message sent!";
    }
}

/**
 * Modify the email template to the given context
 *
 * @param string $context the subject matter of the email (a specific string)
 * @param string $username the user name of the email recipient
 * @return string the modified email body
 */

function constructBody($context,$username,$friendname) {
    $body = file_get_contents('../templates/email.html');
    switch ($context) {
    case 'refer':
        $subject = 'A friend invited you to join Play Talk .Win!';
        $body = str_replace('%emailbody%',
            "Join Today!</h1>
            <br>Your friend ".$friendname." has invited you to join the Play Talk .Win community.
            <br><br>Play Talk .Win is a gaming and social networking site were you can buy prizes by playing
            games and earning coins. Come check us out by clicking on the link below and consider joining today! There's also
            a special bonus waiting for you and your friend &#128521;"
        ,$body);
        return array('subject' => $subject,'body' => $body);
    case 'welcome':
        $subject = 'Welcome to Play Talk .Win! Verify your email.';
        $body = str_replace('%emailbody%',
            "Welcome ".$username."!</h1>
            <br> We're excited you're here! Enjoy your time with us and activate your new account by clicking the link below!
            <br><br> Remember to invite your friends to join for more fun and bonus coins for both of you!"
        ,$body);
        return array('subject' => $subject,'body' => $body);
    }
}