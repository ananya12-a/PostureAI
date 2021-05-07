# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from app.home import blueprint
from flask import render_template, redirect, url_for, request
from flask_login import login_required, current_user
from app import login_manager
from jinja2 import TemplateNotFound
from datetime import date
from dateutil.relativedelta import *

exercises = ["Squat", "Lunge", "Side Lunge"]
colours = ["success", "info", "warning"]
exercise_images = ["squat.png", "lunge.png", "sideLunge.png"]
print('called')
@blueprint.route('/index')
@login_required
def index():

    return render_template('dashboard.html', segment='index')

@blueprint.route('/<template>')
@login_required
def route_template(template):

    try:

        if not template.endswith( '.html' ):
            template += '.html'

        # Detect the current page
        segment = get_segment( request )

        # Serve the file (if exists) from app/templates/FILE.html
        return render_template( template, segment=segment , exercise_len = len(exercises), exercises = exercises, colours = colours, exercise_icons = exercise_images, date = date.today().strftime("%b %d"), next_month = date(date.today().year, date.today().month + 1, date.today().day).strftime("%b %d"))

    except TemplateNotFound:
        return render_template('page-404.html'), 404
    
    except:
        return render_template('page-500.html'), 500

# Helper - Extract current page name from request 
def get_segment( request ): 

    try:

        segment = request.path.split('/')[-1]

        if segment == '':
            segment = 'index'

        return segment    

    except:
        return None  
