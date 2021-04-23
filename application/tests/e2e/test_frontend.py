import unittest
from selenium import webdriver


from app import db
from application.models import User, Podcast
from application.tests.base import BaseTestCase
from application.tests.utils import get_real_podcasts, delete_dummy_podcasts


class TestFrontendPackage(BaseTestCase):
    def setUp(self):
        super(TestFrontendPackage, self).setUp()

        self.browser = webdriver.Chrome('/usr/bin/chromedriver')
        self.browser.implicitly_wait(10)

    def tearDown(self):
        super(TestFrontendPackage, self).tearDown()
        self.browser.quit()

    def test_main_page_can_be_opened(self):
        self.browser.get('http://localhost:5000')
        header = self.browser.find_element_by_tag_name('h2').text
        self.assertEqual(header, 'hello')


if __name__ == '__main__':
    unittest.main()
