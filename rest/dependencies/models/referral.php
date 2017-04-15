<?php

function referFriend($id,$friendEmail,$name) {
    if (!$friendEmail || !$name) return 'Missing parameters';
    $checkUsers = R::findOne('user','email = :email',[':email'=>$friendEmail]);
    $checkReferrals = R::findOne('referrals','friend_email = :email',[':email'=>$friendEmail]);
    if (!$checkUsers) {
        if (!$checkReferrals) {
            $user = R::load('user',$id);
            $user->coins += 10;
            $referral = R::dispense('referrals');
            $referral->user_id = $id;
            $referral->friend_email = $friendEmail;
            R::store($referral);
            R::store($user);
            sendEmail($friendEmail,strip_tags($name),'refer',$user->username);
            return 'Invitation sent. Thank you!';
        }
        return 'This person has already been sent a referral!';
    }
    return 'This person is already a registered user!';
}

function handleReferral($email) {
    $referral = R::findOne('referrals','friend_email = :email',[':email'=>$email]);
    if ($referral) {
        $user = R::load('user',$referral->user_id);
        $user->coins += 50;
        R::store($user);
        R::trash($referral);
        return true;
    }
    return false;
}
